document.addEventListener('DOMContentLoaded', function () {
    // const filesData = [
    //     { "name":"Folder of a Down", "type":"directory", "mtime":"Wed, 07 Mar 2018 20:50:05 GMT" },
    //     { "name":"570000000099601002726911.xml", "type":"file", "mtime":"Tue, 01 Apr 2014 10:33:24 GMT", "size":8582 },
    //     { "name":"alma.xml", "type":"file", "mtime":"Tue, 01 Apr 2014 10:33:24 GMT", "size":85832 },
    //     { "name":"bkorte.xml", "type":"file", "mtime":"Tue, 01 Apr 2014 10:33:24 GMT", "size":858902 }
    // ]; //ha nyomom a devet localon akkor kell
    const filesData = JSON.parse(document.getElementsByClassName('files')[1].innerText);
    let sorting = {
        name: 'desc',
        date: 'desc',
        size: 'desc'
    };

    function renderFiles() {
        const filesContainer = document.getElementsByClassName('files')[1];
        filesContainer.innerHTML = '';
        const footer = document.getElementsByClassName('footer')[0];
        const showDirectories = document.getElementById('showDirectories').checked;
        const showFiles = document.getElementById('showFiles').checked;
        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        for (const file of filesData) {
            if ((file.type === 'directory' && !showDirectories) || (file.type === 'file' && !showFiles)) {
                continue;
            }
            if (searchInput && !file.name.toLowerCase().includes(searchInput)) {
                continue;
            }

            const fileDiv = document.createElement('div');
            fileDiv.classList.add('file');
            fileDiv.innerHTML = `<p>
            ${file.type === 'file' ? '<i class="fa-solid fa-file"></i>' : '<i class="fa-solid fa-folder"></i>'}
            <strong>${file.name}</strong></p>
            <p class="file-info">${formatDate(file.mtime)} - ${formatSize(file.size)}</p>
            `;
            fileDiv.onclick = function () {
                if (file.type === 'file') {
                    window.open(location.href + file.name, '_blank');
                } else {
                    window.open(location.href + file.name, '_self');
                }
            };
            filesContainer.appendChild(fileDiv);
        }

        footer.innerHTML = footer.innerHTML.replace('[file_number]', filesData.filter(file => file.type === 'file').length);
        footer.innerHTML = footer.innerHTML.replace('[folder_number]', filesData.filter(file => file.type === 'directory').length);
        footer.innerHTML = footer.innerHTML.replace('[file_size]', formatSize(filesData.filter(file => file.type === 'file').reduce((acc, file) => acc + file.size, 0)));
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', options);
    }

    function sortFiles(sortBy, sortOrder) {
        const nameHeader = document.querySelector('.sort-name');
        const dateHeader = document.querySelector('.sort-date');
        const sizeHeader = document.querySelector('.sort-size');

        filesData.sort((a, b) => {
            if (sortOrder == 'asc') {
                if (sortBy == 'name') {
                    sorting.name = 'desc';
                    nameHeader.innerHTML = 'Fájl neve <i class="fa-solid fa-down-long"></i>';
                    return a.name.localeCompare(b.name);
                } else if (sortBy == 'mtime') {
                    sorting.date = 'desc';
                    dateHeader.innerHTML = 'Módosítás dátuma <i class="fa-solid fa-down-long"></i>';
                    return new Date(a.mtime) - new Date(b.mtime);
                } else if (sortBy == 'size') {
                    sorting.size = 'desc';
                    sizeHeader.innerHTML = 'Fájl mérete <i class="fa-solid fa-down-long"></i>';
                    return a.size - b.size;
                }
            } else if (sortOrder == 'desc') {
                if (sortBy == 'name') {
                    sorting.name = 'asc';
                    nameHeader.innerHTML = 'Fájl neve <i class="fa-solid fa-up-long"></i>';
                    return b.name.localeCompare(a.name);
                } else if (sortBy == 'mtime') {
                    sorting.date = 'asc';
                    dateHeader.innerHTML = 'Módosítás dátuma <i class="fa-solid fa-up-long"></i>';
                    return new Date(b.mtime) - new Date(a.mtime);
                } else if (sortBy == 'size') {
                    sorting.size = 'asc';
                    sizeHeader.innerHTML = 'Fájl mérete <i class="fa-solid fa-up-long"></i>';
                    return b.size - a.size;
                }
            }
        });
        renderFiles();
    }

    function formatSize(sizeInBytes) {
        const kilobyte = 1024;
        const megabyte = kilobyte * 1024;
        const gigabyte = megabyte * 1024;

        if (sizeInBytes == undefined) {
            return `Mappa`;
        } else if (sizeInBytes < kilobyte) {
            return `${sizeInBytes} B`;
        } else if (sizeInBytes < megabyte) {
            return `${(sizeInBytes / kilobyte).toFixed(2)} KB`;
        } else if (sizeInBytes < gigabyte) {
            return `${(sizeInBytes / megabyte).toFixed(2)} MB`;
        } else {
            return `${(sizeInBytes / gigabyte).toFixed(2)} GB`;
        }
    }

    function updateNavbar() {
        const navbar = document.getElementsByClassName('path')[0];
        const location = window.location.href.split('/');

        for(let i = 2; i < location.length; i++) {
            const path = location[i];
            const pathLink = document.createElement('a');
            pathLink.innerText = path;
            pathLink.href = window.location.href.split(path)[0] + path;
            navbar.appendChild(pathLink);
            if (i < location.length - 1) {
                navbar.innerHTML += '/';
            }
        }
    }

    function addSortEventListeners() {
        const nameHeader = document.querySelector('.sort-name');
        const dateHeader = document.querySelector('.sort-date');
        const sizeHeader = document.querySelector('.sort-size');

        nameHeader.addEventListener('click', () => sortFiles('name', sorting.name));
        dateHeader.addEventListener('click', () => sortFiles('mtime', sorting.date));
        sizeHeader.addEventListener('click', () => sortFiles('size', sorting.size));
    }

    function createFooter() {
        const newDiv = document.createElement('div');
        newDiv.classList.add('footer');
        newDiv.innerHTML = `<p><i class="fa-solid fa-file"></i>[file_number] <i class="fa-solid fa-folder"></i>[folder_number] - [file_size]</p>`

        document.body.appendChild(newDiv);
    }

    document.getElementById('showDirectories').addEventListener('change', renderFiles);
    document.getElementById('showFiles').addEventListener('change', renderFiles);
    document.getElementById('searchInput').addEventListener('input', renderFiles);

    createFooter();
    renderFiles();
    updateNavbar();
    addSortEventListeners();
    sortFiles('name', 'asc')
});