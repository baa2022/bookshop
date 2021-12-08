using { sap.capire.bookshop as data } from '../db/schema';

service AdminService @(_requires:'authenticated-user') {
    entity Books as projection on data.Books;
    entity Authors as projection on data.Authors ;
    entity Orders as projection on data.Orders;
    entity OrderItems as projection on data.Orders.items;
    entity Genres as projection on data.Genres;
}