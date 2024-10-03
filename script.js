const books = [
    { id: 1,
      title: "求生篇", 
      cover: "qiusheng.jpg?height=400&width=300",
      link: "#",
      summary: "In a world where ancient powers resurface, one woman discovers her hidden abilities and becomes the key to humanity's survival." 
    },
    { id: 2,
      title: "救世篇",
      cover: "jiushi.jpg?height=400&width=300",
      link: "https://khee-huang.gitbook.io/vipralopa/mo-shi-jie-jiu-shi-pian",
      summary: "A timeless love story spanning centuries, where past and present collide in a dance of destiny and desire." 
    },
    { id: 3,
      title: "机密档案",
      cover: "jimidangan.jpg?height=400&width=300",
      link: "https://khee-huang.gitbook.io/vipralopa",
      summary: "Uncover the secrets of a lost civilization as a team of archaeologists face supernatural threats in the depths of an ancient ruin." 
    },
    { id: 4,
      title: "死囚 X",
      cover: "siqiux.jpg?height=400&width=300",
      link: "https://khee-huang.gitbook.io/vipralopa/mo-shi-jie-si-qiu-x",
      summary: "A mind-bending journey through space and consciousness, where reality bends and the impossible becomes possible." 
    },
];

const bookGrid = document.getElementById('bookGrid');
const bookDetail = document.getElementById('bookDetail');

function createBookGrid() {
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
        `;
        bookItem.addEventListener('click', () => showBookDetail(book));
        bookGrid.appendChild(bookItem);
    });
}

function showBookDetail(book) {
    bookGrid.style.display = 'none';
    bookDetail.style.display = 'flex';
    bookDetail.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <div>
            <h2>${book.title}</h2>
            <p>${book.summary}</p>
            <div>
                <a href="${book.link}" class="button">开始阅读</a>
                <a href="#" class="button button-outline" id="returnToShelf">放回书架</a>
            </div>
        </div>
    `;
    document.getElementById('returnToShelf').addEventListener('click', returnToShelf);
    animateBookDetail();
}

function returnToShelf(e) {
    e.preventDefault();
    bookDetail.style.display = 'none';
    bookGrid.style.display = 'grid';
    animateBookGrid();
}

function animateBookDetail() {
    bookDetail.style.opacity = '0';
    bookDetail.style.transform = 'translateX(-100px)';
    setTimeout(() => {
        bookDetail.style.transition = 'opacity 0.5s, transform 0.5s';
        bookDetail.style.opacity = '1';
        bookDetail.style.transform = 'translateX(0)';
    }, 50);
}

function animateBookGrid() {
    const bookItems = bookGrid.querySelectorAll('.book-item');
    bookItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s, transform 0.5s';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

createBookGrid();
animateBookGrid();