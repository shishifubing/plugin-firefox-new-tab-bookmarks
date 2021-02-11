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
    bookmarks.setAttribute('class', 'd-flex flex-column flex-lg-row flex-fill bg-dark rounded-3');
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
    node.setAttribute('class', 'd-flex flex-column rounded-3 p-1');
    node.style.cursor = 'pointer';
    let nodeHeader = document.createElement('div');
    nodeHeader.setAttribute('id', id + '-header');
    nodeHeader.setAttribute('class', 'list-group-item bg-dark rounded-3');
    let link = document.createElement('a');
    link.setAttribute('class', 'text-decoration-none text-light rounded-3 m-1');
    let nodeBody = document.createElement('div');
    nodeBody.setAttribute('id', id + '-content');
    nodeBody.setAttribute('class', 'offset-1');
    if (url) {
        link.setAttribute('href', url);
        link.classList.add('bg-dark');
    } else {
        node.classList.add('border-node');
        nodeHeader.setAttribute('title', id);
        nodeHeader.addEventListener('click',
            (event) => {
                document.getElementById(event.target.title + '-content').classList.toggle('collapse');
                document.getElementById(event.target.title + '-header-icon').classList.toggle('header-icon-folder-turned');
                event.stopPropagation();
            });
        nodeBody.addEventListener('click',
            (event) => {
                document.getElementById(event.target.id + '-content').classList.toggle('collapse');
                event.stopPropagation();
            });
        let icon = document.createElement('img');
        icon.setAttribute('id', nodeHeader.id + '-icon');
        icon.setAttribute('class', 'me-2 header-icon-folder');
        icon.src = '../icons/folder_arrow.png';
        icon.alt = 'folder_arrow';
        link.appendChild(icon);
    }
    if (folder.id === 'bookmarks') {
        node.style.width = '100%';
    } else {
        nodeBody.classList.toggle('collapse');
    }

    link.appendChild(document.createTextNode(title));
    folder.appendChild(node);
    node.appendChild(nodeHeader);
    if (!url) { node.appendChild(nodeBody); }
    nodeHeader.appendChild(link);
    return nodeBody;
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


