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
    const bookmarks = document.createElement('div');
    bookmarks.setAttribute('id', 'bookmarks');
    bookmarks.setAttribute('class', 'bg-dark rounded-3 d-flex flex-lg-row flex-fill');
    createBookmarkNode(bookmarkItemTree[0], bookmarks);
    document.getElementById('main').appendChild(bookmarks);
    //saveBookmarkTree(bookmarkTree);
}

function saveBookmarkTree(bookmarkTree) {
    browser.storage.local.set(
        { bookmarks: bookmarkTree.outerHTML }
    );
}

function createBookmarkNode(bookmarkItem, folder) {
    let node;
    if (bookmarkItem.id === 'root________'
        || (folder.id === 'bookmarks' && !bookmarkItem.children.length)) {
        node = folder;
    } else {
        node = createNode(bookmarkItem, folder);
    }
    if (bookmarkItem.children) {
        if (bookmarkItem.children.length !== 0) {
            for (child of bookmarkItem.children) {
                createBookmarkNode(child, node);
            }
        }
    }
    return node;
}

function createNode(bookmarkItem, folder) {
    let id = bookmarkItem.id;
    let url = bookmarkItem.url;
    let title = bookmarkItem.title ? bookmarkItem.title : url;
    let node = document.createElement('div');
    node.setAttribute('id', id);
    node.setAttribute('class', 'd-flex flex-column bg-dark');
    let nodeHeader = document.createElement('div');
    nodeHeader.setAttribute('style', 'cursor: pointer;');
    let link = document.createElement('a');
    link.setAttribute('class', 'text-decoration-none text-light round-3 m-1');
    let nodeBody = document.createElement('div');
    nodeBody.setAttribute('id', id + '-content');
    nodeBody.setAttribute('class', 'list-group');
    if (url) {
        link = document.createElement('a');
        link.appendChild(document.createTextNode(title));
        link.setAttribute('href', url);
        link.classList.add('list-group-item');
        link.classList.add('round-3');
        link.classList.add('bg-dark');
        link.classList.add('list-group-item-action');
    } else {
        nodeHeader.setAttribute('title', id + '-content');
        nodeHeader.addEventListener('click', (event) => {
            document.getElementById(event.target.title).classList.toggle('collapse');

        });

        let icon = document.createElement('img');
        icon.src = '../icons/folder_arrow.png';
        icon.width = '10';
        icon.height = '10';
        icon.alt = 'folder_arrow';
        icon.margin = '0 3px 0 0';
        icon.title = id;
        //icon.onclick = link.onclick;
        link.appendChild(icon);
        link.appendChild(document.createTextNode(title));


    }
    folder.appendChild(node);
    node.appendChild(nodeHeader);
    if (!url) { node.appendChild(nodeBody); }
    nodeHeader.appendChild(link);
    return nodeBody;
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


