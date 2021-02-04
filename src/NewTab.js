(async function () {
    /*browser.storage.local.get('bookmarks').then(
        (object) => {
            document.getElementById('bookmarks') = object.bookmarks;
        },
        
        });*/
    browser.bookmarks.getTree().then(
        displayBookmarkTree, onRejected
    );
})()


function displayBookmarkTree(bookmarkItemTree) {
    var bookmarkTree = createBookmarkNode(bookmarkItemTree[0]);
    document.getElementById('main').appendChild(bookmarkTree);
    //saveBookmarkTree(bookmarkTree);
}

function saveBookmarkTree(bookmarkTree) {
    browser.storage.local.set(
        { bookmarks: bookmarkTree.outerHTML }
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

    var node = null;
    if (!folder) {
        node = document.createElement('div');
        id = 'bookmarks';
        node.id = 'bookmarks';
        node.title = 'bookmarks';
    } else {
        node = document.createElement(tag);
        node.id = id;
        node.title = title;
        if (folder.id !== 'bookmarks') {
            node.className = 'hideChildren';
        } else {
            node.classList.add('rootFolder');
        }
        var link = document.createElement('a');
        var text = document.createTextNode(title);
        link.href = url;
        link.title = id;
        if (tag === 'ul') {
            if (!node.classList.contains('rootFolder')) {
                node.onclick = event => {
                    event.target.classList.toggle('hideChildren');
                };
            }
            link.className = 'folderLink';
            link.onclick = event => {
                document.getElementById(event.target.title).classList.toggle('hideChildren');
                console.log(event.target.title);
            };
            var icon = document.createElement('img');
            icon.src = '../icons/folder_arrow.png';
            icon.width = '10';
            icon.height = '10';
            icon.alt = 'folder_arrow';
            icon.margin = '0 3px 0 0';
            icon.title = id;
            //icon.onclick = link.onclick;
            link.appendChild(icon);
        }
        link.appendChild(text);
        node.appendChild(link);
        folder.appendChild(node);
    }
    if (bookmarkItem.children) {
        if (bookmarkItem.children.length !== 0) {
            for (child of bookmarkItem.children) {
                createBookmarkNode(child, node);
            }
        } else {
            node.style.display = 'none';
        }
    }
    return node;
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


