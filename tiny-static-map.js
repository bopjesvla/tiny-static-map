async function createStaticMap(mapContainer, lat, lon, zoom, width, height) {
    const TILE_SIZE = 256;

    // Calculate pixel coordinates for the center point at the given zoom level
    const centerX = lonToPixelX(lon, zoom);
    const centerY = latToPixelY(lat, zoom);

    // Calculate top-left corner coordinates
    const topLeftX = centerX - width / 2;
    const topLeftY = centerY - height / 2;

    // Calculate tile numbers and offsets
    const startTileX = Math.floor(topLeftX / TILE_SIZE);
    const startTileY = Math.floor(topLeftY / TILE_SIZE);
    const xOffset = -(topLeftX % TILE_SIZE);
    const yOffset = -(topLeftY % TILE_SIZE);

    // Determine the number of tiles needed to cover the dimensions
    const xTiles = Math.ceil(width / TILE_SIZE) + 1;
    const yTiles = Math.ceil(height / TILE_SIZE) + 1;

    // Load and position each tile
    for (let x = 0; x < xTiles; x++) {
        for (let y = 0; y < yTiles; y++) {
            const tileX = startTileX + x;
            const tileY = startTileY + y;

            // Construct tile URL
            const tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

            // Create an img element for each tile
            const img = document.createElement("img");
            img.src = tileUrl;
            img.style.position = 'absolute';
            img.style.backgroundSize = 'cover';
            img.style.width = `${TILE_SIZE}px`;
            img.style.height = `${TILE_SIZE}px`;
            img.style.left = `${(x * TILE_SIZE) + xOffset}px`;
            img.style.top = `${(y * TILE_SIZE) + yOffset}px`;

            // Append the tile image to the map container
            mapContainer.appendChild(img);
        }

        // Set mapContainer styling
        mapContainer.style.width = width+'px';
        mapContainer.style.height = height+'px';
        mapContainer.style.position = 'relative';
        mapContainer.style.overflow = 'hidden';
    }
}

// Convert longitude to pixel X coordinate at given zoom level
function lonToPixelX(lon, zoom) {
    return ((lon + 180) / 360) * Math.pow(2, zoom) * 256;
}

// Convert latitude to pixel Y coordinate at given zoom level
function latToPixelY(lat, zoom) {
    const rad = lat * Math.PI / 180;
    return (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * Math.pow(2, zoom) * 256;
}
