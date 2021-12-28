using {sap.capire.bookshop as data} from '../db/schema';

service FreestyleService @(_requires : 'authenticated-user') {
    entity Books        as projection on data.Books;
    entity Authors      as projection on data.Authors;
    entity Orders       as projection on data.Orders;
    entity Orders_items as projection on data.Orders.items;
    entity Genres       as projection on data.Genres;
}

service FioriService @(_requires : 'authenticated-user') {
    entity Books @(restrict : [
        {
            grant : ['READ'],
            to    : ['BooksViewer']
        },
        {
            grant : ['*'],
            to    : ['BooksManager']
        }
    ])                  as projection on data.Books;

    annotate Books with @odata.draft.enabled;

    entity Authors @(restrict : [
        {
            grant : ['READ'],
            to    : ['BooksViewer']
        },
        {
            grant : ['*'],
            to    : ['BooksManager']
        }
    ])                  as projection on data.Authors;

    entity Orders @(restrict : [
        {
            grant : ['READ'],
            to    : ['BooksViewer']
        },
        {
            grant : ['*'],
            to    : ['BooksManager']
        }
    ])                  as projection on data.Orders;

    entity Orders_items as projection on data.Orders.items;
    entity Genres       as projection on data.Genres;
}
