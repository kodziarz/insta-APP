class ImageData {
    id
    album
    originalName
    url
    lastChange
    history = []

    constructor(album, originalName, url) {
        this.id = new Date().getTime()
        this.album = album
        this.originalName = originalName
        this.url = url
        this.lastChange = "original"
    }
}