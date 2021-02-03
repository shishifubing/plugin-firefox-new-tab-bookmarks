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
    var tag = 'li';
    var url = bookmarkItem.url;
    if (!url) {
        url = '#' + title;
        tag = 'ul';
    }
    if (!title) {
        title = url
    };

    if (!folder) {
        id = 'bookmarks';
    } else {
        var node = document.createElement(tag);
        node.id = id;
        node.title = title;
        if (folder !== 'bookmarks') {
            node.className = 'hideChildren';
        } else {
            node.classList.add('rootFolder');
        }
        var link = document.createElement('a');
        var text = document.createTextNode(title);
        link.href = url;
        link.title = id;
        if (tag === 'ul') {
            link.className = 'folderLink';
            link.onclick = event => {
                document.getElementById(event.target.title).classList.toggle('hideChildren');
            };
            var icon = document.createElement('img');
            icon.src = '../icons/folder_arrow.png';
            icon.width = '10';
            icon.height = '10';
            icon.alt = 'folder_arrow';
            icon.padding = '0 5px 0 0';
            //link.appendChild(icon);
        }
        link.appendChild(text);
        node.appendChild(link);
        document.getElementById(folder).appendChild(node);
    }

    if (bookmarkItem.children) {
        if (bookmarkItem.children.length !== 0) {
            for (child of bookmarkItem.children) {
                createBookmarkNode(child, id);
            }
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }


}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


