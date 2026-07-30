import re
from urllib.parse import urlparse

def sanitize_product_url(raw_url: str) -> str:
    """
    Limpia parámetros de rastreo y genera la URL canónica del producto
    para Amazon, eBay y tiendas soportadas.
    """
    if not raw_url:
        return raw_url

    try:
        raw_url = raw_url.strip()
        parsed = urlparse(raw_url)
        domain = parsed.netloc.lower()

        # 1. Amazon: Extrae el ASIN (10 caracteres alfanuméricos)
        if "amazon" in domain:
            match = re.search(r'(?:dp|gp/product)/([A-Z0-9]{10})', raw_url, re.IGNORECASE)
            if match:
                asin = match.group(1).upper()
                return f"https://{parsed.netloc}/dp/{asin}"

        # 2. eBay: Extrae el ID del item (números)
        elif "ebay" in domain:
            match = re.search(r'/itm/(\d+)', raw_url)
            if match:
                item_id = match.group(1)
                return f"https://{parsed.netloc}/itm/{item_id}"

        # Respaldo genérico: Elimina la query string (?key=value&...)
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    except Exception:
        return raw_url