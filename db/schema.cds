using {cuid, sap.common } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Books: cuid {
    stock: Integer;
    price: Decimal(9, 2);
    currency: String(111) default 'USD';
    title: String(111);
    descr: String(1111);
    genre: Association to Genres;
    author: Association to Authors;
    rating: Integer;
    orders: Association to many Orders.items on orders.book = $self;
}

entity Authors: cuid {
    fullName: String(111);
    creationDateTime: DateTime;
    books: Association to many Books on books.author = $self @assert.integrity: false;
}

entity Orders: cuid {
    date: Date;
    fullName: String(111);
    email: String(111);
    phone: String(111);
    address: String(300);

    items: Composition of many {
        quantity: Integer;
        key book: Association to Books @assert.integrity: false;
    };
}

entity Genres {
    key title: String(111);
    books: Association to many Books on books.genre = $self @assert.integrity: false;
}