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
    const bookmarks = document.getElementById('bookmarks');
    const bookmarkTree = createBookmarkNode(bookmarkItemTree[0]);
    bookmarks.appendChild(bookmarkTree);
    //saveBookmarkTree(bookmarkTree);
}

function saveBookmarkTree(bookmarkTree) {
    browser.storage.local.set(
        { bookmarks: bookmarkTree.outerHTML }
    );
}

function createBookmarkNode(bookmarkItem, folder) {
    let id = bookmarkItem.id;
    let url = bookmarkItem.url;
    let title = bookmarkItem.title ? bookmarkItem.title : url;
    let node = document.createElement('div');
    node.setAttribute('id', id);
    node.setAttribute('class', 'd-flex flex-column');
    let nodeHeader = document.createElement('div');
    nodeHeader.setAttribute('class', 'card-header');
    let link = document.createElement('a');
    link.appendChild(document.createTextNode(title));
    console.log(link.innerHTML);
    let nodeBody = document.createElement('div');
    if (url) {
        link.setAttribute('class', 'list-group-item');
    } else {
        link.setAttribute('href', '#' + id + '-list-group');
        link.setAttribute('data-toggle', 'collapse');
        nodeBody.setAttribute('id', id + '-list-group');
        nodeBody.setAttribute('class', 'list-group collapse');
    }
    /*if (!url) {
        let icon = document.createElement('img');
        icon.src = '../icons/folder_arrow.png';
        icon.width = '10';
        icon.height = '10';
        icon.alt = 'folder_arrow';
        icon.margin = '0 3px 0 0';
        icon.title = id;
        //icon.onclick = link.onclick;
        link.appendChild(icon);
    }*/
    node.appendChild(nodeHeader);
    nodeHeader.appendChild(link);
    node.appendChild(nodeBody);
    if (!folder) {
        nodeBody = bookmarks;
    } else {
        folder.appendChild(node);
    }

    if (bookmarkItem.children) {
        if (bookmarkItem.children.length !== 0) {
            for (child of bookmarkItem.children) {
                createBookmarkNode(child, nodeBody);
            }
        } else {
            //node.style.display = 'none';
        }
    }
    return node;
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


