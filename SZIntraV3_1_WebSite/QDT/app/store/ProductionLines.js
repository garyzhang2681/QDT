Ext.define("QDT.store.ProductionLines", {
    extend: 'Ext.data.Store',
    model: 'QDT.model.ProductionLine',

    data: [
        { "production_line": "Actuation", code: "A" },
        { "production_line": "Machining", code: "M" },
        { "production_line": "Composite", code: "C" },
        { "production_line": "Structures", code: "S" }
    ]
});



