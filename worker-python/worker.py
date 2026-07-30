# worker.py
import os
import json
import time
import redis
import psycopg2
from playwright.sync_api import sync_playwright

from utils import sanitize_product_url

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
QUEUE_NAME = "scraping_queue"

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "pricetracker")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )

def extract_price_ebay(page):
    price_element = page.query_selector(".x-price-primary span") or page.query_selector("#prcIsum")
    if price_element:
        raw_text = price_element.inner_text()
        cleaned = "".join([c for c in raw_text if c.isdigit() or c == '.'])
        return float(cleaned) if cleaned else None
    return None

def extract_price_amazon(page):
    price_element = page.query_selector(".a-price .a-offscreen")
    if price_element:
        raw_text = price_element.inner_text()
        cleaned = "".join([c for c in raw_text if c.isdigit() or c == '.'])
        return float(cleaned) if cleaned else None
    return None

def process_scraping_job(job_data, browser):
    product_id = job_data.get("id")
    raw_url = job_data.get("url")

    # Nos aseguramos de que la URL esté limpia antes de navegar
    url = sanitize_product_url(raw_url)
    platform = job_data.get("platform", "UNKNOWN")

    print(f"[*] Procesando Producto ID: {product_id} | Plataforma: {platform} | URL: {url}")

    context = browser.new_context()
    page = context.new_page()

    price = None
    try:
        page.goto(url, timeout=30000, wait_until="domcontentloaded")

        if platform == "EBAY":
            price = extract_price_ebay(page)
        elif platform == "AMAZON":
            price = extract_price_amazon(page)
        else:
            price = extract_price_ebay(page) or extract_price_amazon(page)

    except Exception as e:
        print(f"[!] Error navegando a la URL: {e}")
    finally:
        context.close()

    if price is not None:
        print(f"[✓] Precio obtenido: ${price}")
        save_price_history(product_id, price)
    else:
        print(f"[X] No se pudo extraer el precio de {url}")

def save_price_history(product_id, price):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
                       INSERT INTO price_history (product_id, price, fetched_at)
                       VALUES (%s, %s, NOW());
                       """
        cursor.execute(insert_query, (product_id, price))
        conn.commit()

        cursor.close()
        conn.close()
        print(f"[+] Guardado en DB para product_id={product_id}")
    except Exception as e:
        print(f"[!] Error guardando en PostgreSQL: {e}")

def main():
    print("[*] Iniciando Worker Python y conectando a Redis...")

    r = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=0,
        socket_timeout=None,
        health_check_interval=30
    )

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        print("[*] Navegador Chromium listo. Escuchando cola...")

        try:
            while True:
                try:
                    result = r.blpop(QUEUE_NAME, timeout=10)

                    if result is None:
                        continue

                    _, item = result
                    job_data = json.loads(item.decode('utf-8'))
                    process_scraping_job(job_data, browser)

                except redis.exceptions.TimeoutError:
                    time.sleep(1)
                except json.JSONDecodeError as e:
                    print(f"[!] Error al parsear JSON: {e}")
                except Exception as e:
                    print(f"[!] Error inesperado en loop principal: {e}")
                    time.sleep(1)
        finally:
            browser.close()

if __name__ == "__main__":
    main()