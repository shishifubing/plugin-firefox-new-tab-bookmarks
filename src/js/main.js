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
    bookmarks.setAttribute('class', 'd-flex flex-column flex-lg-row flex-fill bg-dark rounded-10');
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
    node.setAttribute('title', id);
    node.setAttribute('class', 'd-flex flex-column rounded-1');
    node.style.cursor = 'pointer';
    let nodeHeader = document.createElement('div');
    nodeHeader.setAttribute('id', id + '-header');
    nodeHeader.setAttribute('title', id);
    nodeHeader.setAttribute('class', 'list-group-item bg-dark ps-1');
    let link = document.createElement('a');
    link.setAttribute('class', 'text-decoration-none text-light m-1');
    link.style.display = 'block';
    link.setAttribute('title', id);
    let nodeBody = document.createElement('div');
    nodeBody.setAttribute('id', id + '-content');
    nodeBody.setAttribute('class', 'offset-02');
    nodeBody.setAttribute('title', id);
    if (url) {
        link.setAttribute('href', url);
        link.classList.add('bg-dark');
    } else {
        node.classList.add('border-node');
        link.addEventListener('click', (event) => collapseBorder(event));
        nodeBody.addEventListener('click', (event) => collapseBorder(event));
        node.addEventListener('click', (event) => collapseBorder(event));
        let icon = document.createElement('img');
        icon.setAttribute('id', nodeHeader.id + '-icon');
        icon.setAttribute('class', 'me-1 header-icon-folder');
        icon.src = '../icons/folder_arrow.png';
        icon.alt = 'folder_arrow';
        link.appendChild(icon);
    }
    if (folder.id === 'bookmarks') {
        node.classList.add('m-3');
        node.classList.add('root-folder');
    } else {
        nodeBody.classList.toggle('collapse');
        node.classList.add('me-1');
    }

    link.appendChild(document.createTextNode(title));
    folder.appendChild(node);
    node.appendChild(nodeHeader);
    if (!url) { node.appendChild(nodeBody); }
    nodeHeader.appendChild(link);
    return nodeBody;
}

function collapseBorder(event) {
    if (!event.target.href) {
        document.getElementById(event.target.title + '-content').classList.toggle('collapse');
        document.getElementById(event.target.title + '-header-icon').classList.toggle('header-icon-folder-turned');
        event.stopPropagation();
    }
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}


