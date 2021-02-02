(async function () {
    browser.bookmarks.onCreated.addListener(displayBookmarkTree);
    browser.storage.local.get('bookmarks').then(
        () => {
            browser.bookmarks.getTree().then(
                displayBookmarkTree, onRejected
            );
        });
    /*
    (object) => {
    document.getElementById('bookmarks').innerHTML = object.bookmarks;
    },
    */
})()


function displayBookmarkTree(bookmarkTree) {
    createBookmarkNode(bookmarkTree[0]);
    saveState();
}

function saveState() {
    browser.storage.local.set(
        { bookmarks: document.getElementById('bookmarks').innerHTML }
    );
}

function createBookmarkNode(bookmarkItem, folder) {
    var id = bookmarkItem.id;
    var title = bookmarkItem.title;
    var url = bookmarkItem.url;

    if (!folder) {
        id = 'bookmarks';
    } else if (url) {
        var node = document.createElement('li');
        node.id = id;
        node.title = title;
        var link = document.createElement('a');
        link.href = url;
        link.text = title;
        node.appendChild(link);
        document.getElementById(folder).appendChild(node);
    } else {
        var node = document.createElement('ul');
        node.id = id;
        node.title = title;
        var link = document.createElement('a');
        link.href = '#' + title;
        link.text = title;
        link.title = id;
        link.onclick = event => {
            document.getElementById(event.target.title).classList.toggle('hideChildren');
        };
        node.appendChild(link);
        document.getElementById(folder).appendChild(node);
    }

    //console.log(folder + ' / ' + title + ' / ' + type + ' / ' + id);
    if (bookmarkItem.children) {
        for (child of bookmarkItem.children) {
            createBookmarkNode(child, id);
        }
    }


}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


