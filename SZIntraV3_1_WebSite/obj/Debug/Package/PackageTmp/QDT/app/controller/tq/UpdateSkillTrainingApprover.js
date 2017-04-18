Ext.define('QDT.controller.tq.UpdateSkillTrainingApprover', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.SkillTrainingApproverEditor'
    ],

    refs: [{
        ref: 'skillTrainingApproverEditor',
        selector: 'tq-skilltrainingapprovereditor'
    }],

    init: function () {
        var me = this;

        me.control({
            'tq-skilltrainingapprovereditor #submit': {
                click: function () {
                    var grid = me.getSkillTrainingApproverEditor().down('tq-skilltrainingapprovergrid');
                    if (grid.getProcessApprovers().length > 0) {
                        DpTq.UpdateSkillTrainingApprovers(grid.requestId, grid.getProcessApprovers(), function (result) {
                            QDT.util.Util.generalCallbackCRUD(result, 'u');
                        });
                    }
                }
            },

            'tq-skilltrainingapprovereditor #cancel': {
                click: function () {
                    me.getSkillTrainingApproverEditor().close();
                }
            }
        });
    }
});