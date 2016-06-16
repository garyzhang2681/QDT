Ext.define('QDT.model.tq.PersonProcessSkill', {
    extend: 'Ext.data.Model',
    //    fields: ['id', 'pid', 'emp_name', 'skill', 'start_date', 'fileid', 'cur_seq'
    //        , {
    //            name: 'stage0', convert: stageStatus, defaultValue: 0
    //        }
    //            , {
    //                name: 'stage1', convert: stageStatus, defaultValue: 1
    //            }, {
    //                name: 'stage2', convert: stageStatus, defaultValue: 2
    //            }, {
    //                name: 'stage3', convert: stageStatus, defaultValue: 3
    //            }, {
    //                name: 'stage4', convert: stageStatus, defaultValue: 4
    //            }, {
    //                name: 'stage5', convert: stageStatus, defaultValue: 5
    //            }, {
    //                name: 'stage6', convert: stageStatus, defaultValue: 6
    //            }
    //    ],

    constructor: function () {
        var me = this,
            fields = [],
            i;
        fields = [
            'id',
            'employee_id',
            'employee_name',
            'local_id',
            'skill_code',
            'start_time',
            'current_stage'
        ];

        for (i = 1; i < 7; i++) {
            fields.push({
                name: 'stage' + i.toString(),
                defaultValue: i,
                convert: me.stageStatus
            });
        }


        me.callParent()
    },

    stageStatus: function (v, record) {
        var flag;
        flag = parseInt(value) - parseInt(record.data.current_stage);
        if (flag > 0) {
            return 'open';
        }
        else if (flag === 0) {
            return 'pending';
        }
        else {
            return 'approved';
        }
    }

});