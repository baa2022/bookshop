using FioriService as service from '../../srv/admin-service';
using  from '../../srv/common';

annotate service.Books with @(UI : {

    SelectionFields         : [
        genre_title,
        author_ID
    ],

    HeaderInfo              : {
        TypeName       : '{i18n>booklistTableTitle}',
        TypeNamePlural : '{i18n>booklistTablePluralTitle}',
        Title          : {Value : title},
        Description    : {Value : author_ID}
    },

    DataPoint #Rating       : {
        Title         : 'Rating',
        Value         : rating,
        TargetValue   : 5,
        Visualization : #Rating
    },

    LineItem                : [
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>Title}',
            Value             : title,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>Author}',
            Value             : author_ID,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>Genre}',
            Value             : genre_title,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>Price}',
            Value             : price,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataFieldForAnnotation',
            Label             : '{i18n>Rating}',
            Target            : '@UI.DataPoint#Rating',
            ![@UI.Importance] : #Medium
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>Stock}',
            Value             : stock,
            ![@UI.Importance] : #Low
        },
        {
            $Type             : 'UI.DataField',
            Value            : descr,
            ![@UI.Hidden]
        },
    ],

    FieldGroup #BookDetails : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type  : 'UI.DataFieldForAnnotation',
                Label  : 'Rating',
                Target : '@UI.DataPoint#Rating',
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Genre}',
                Value : genre_title
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Stock}',
                Value : stock
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Price}',
                Value : price,
            }
        ]
    },

    FieldGroup #BookDescription: {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Value : descr,
            },
        ]
    },

    Facets: [
        {
            $Type : 'UI.CollectionFacet',
            ID : 'FurtherData',
            Label : '{i18n>BookDetails}',
            Facets : [
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : '{i18n>Description}',
                ID     : 'BookDescriptionFacet',
                Target : '@UI.FieldGroup#BookDescription'
            },
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : '{i18n>Details}',
                ID     : 'BookDetailsFacet',
                Target : '@UI.FieldGroup#BookDetails'
            }
        ]},
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>OrdersDetails}',
            ID     : 'ProcessFlowFacet',
            Target : 'orders/@UI.LineItem',
            // ![@UI.Hidden]: HasActiveEntity
        }
    ]

}) {
    @Measures.ISOCurrency : currency
    price;
};

annotate service.Orders_items with @(UI : {

    HeaderInfo: {
        TypeName       : '{i18n>orderlistTableTitle}',
        TypeNamePlural : '{i18n>orderlistTablePluralTitle}'
    },

    LineItem: [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Fullname}',
            Value : up_.fullName,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Email}',
            Value : up_.email,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Phone}',
            Value : up_.phone,
            ![@UI.Importance] : #High
        },
        {
            $Type  : 'UI.DataField',
            Label  : '{i18n>Address}',
            Value : up_.address,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Quantity}',
            Value : quantity,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Date}',
            Value : up_.date,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataField',
            Value            : book_ID,
            ![@UI.Hidden]
        },
        {
            $Type             : 'UI.DataField',
            Value            : up__ID,
            ![@UI.Hidden]
        },
    ],
});
annotate service.Books with {
    genre @Common.Label : '{i18n>Genres}'
};
annotate service.Books with {
    author @Common.Label : '{i18n>Author}'
};