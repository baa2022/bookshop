using FioriService as service from './admin-service';
using {sap.capire.bookshop as my} from '../db/schema';

annotate service.Books with @odata.draft.enabled {
    ID @UI.Hidden;
    author_ID @UI.Hidden;
    currency @UI.Hidden @readonly @UI.HiddenFilter;

    descr @UI.MultiLineText @UI.HiddenFilter;
    price @title: 'Price' ;
    rating @title: 'Rating';
    stock @title: 'Stock';
    title @title: 'Title';

    genre @title: 'Genres' @Common: {
        Text            : genre.title,
        TextArrangement : #TextOnly,
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Genres',
            CollectionPath : 'Genres',
            Parameters     : [{
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : genre_title,
                ValueListProperty : 'title'
            }]
        }
    };

    author @title: 'Author' @Common: {
        Text            : author.fullName,
        TextArrangement : #TextOnly,
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Authors',
            CollectionPath : 'Authors',
            Parameters     : [{
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : author_ID,
                ValueListProperty : 'ID'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'fullName'
            }]
        }
    };
}

annotate service.Authors with @odata.draft.enabled {
    ID @(Common : {
        Text            : fullName,
        TextArrangement : #TextOnly,
    });
    ID @UI.Hidden;
    fullName @title : 'Author';
}

annotate service.OrderItems with {
    book_ID @UI.Hidden;
    up__ID @UI.Hidden;
}