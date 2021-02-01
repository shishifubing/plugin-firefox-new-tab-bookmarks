function logItems(bookmarkItem, folder) {
    if (bookmarkItem.url) {
        var bookmarkNode = document.createElement('li');
        bookmarkNode.id = bookmarkItem.id;
        bookmarkNode.title = bookmarkItem.title;
        var url = document.createElement('a');
        url.href = bookmarkItem.url;
        url.text = bookmarkItem.title;
        bookmarkNode.appendChild(url);
        document.getElementById(folder).appendChild(bookmarkNode);
    } else {
        var bookmarkNode = document.createElement('ul');
        bookmarkNode.appendChild(document.createTextNode(bookmarkItem.title));
        bookmarkNode.id = bookmarkItem.id;
        bookmarkNode.text = bookmarkItem.title;
        bookmarkNode.title = bookmarkItem.title;
        document.getElementById(folder).appendChild(bookmarkNode);
        if (bookmarkItem.children) {
            for (child of bookmarkItem.children) {
                logItems(child, bookmarkItem.id);
            }
        }
    }
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}

function logTree(bookmarkItems) {
    browser.bookmarks.getTree();
    logItems(bookmarkItems[0], 'bookmarks');
}

; (async function () {
    var gettingTree = browser.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);
})()
