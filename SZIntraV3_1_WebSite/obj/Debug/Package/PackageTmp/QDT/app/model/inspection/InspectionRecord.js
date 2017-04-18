Ext.define('QDT.model.inspection.InspectionRecord', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id', mapping: 'id'
    }, {
        name: 'type', mapping: 'type'
    }, {
        name: 'serial', mapping: 'serial'
    }, {
        name: 'item', mapping: 'item'
    }, {
        name: 'project_id', mapping: 'project_id'
    }, {
        name: 'oper_num', mapping: 'oper_num'
    }, {
        name: 'wo', mapping: 'wo'
    }, {
        name: 'suffix', mapping: 'suffix'
    }, {
        name: 'passed', mapping: 'passed'
    }, {
        name: 'urgent_reason', mapping: 'urgent_reason'
    }, {
        name: 'urgency', mapping: 'urgency'
    }, {
        name: 'create_date', mapping: 'create_date'
    }, {
        name: 'start_time', mapping: 'start_time'
    }, {
        name: 'end_time', mapping: 'end_time'
    }, {
        name: 'quantity', mapping: 'quantity'
    }, {
        name: 'priority', mapping: 'priority'
    }, {
        name: 'create_by', mapping: 'create_by'
    }, {
        name: 'create_by_sso', mapping: 'create_by_sso'
    }, {
        name: 'location', mapping: 'location'
    }, {
        name: 'project', mapping: 'project'
    }, {
        name: 'comments', mapping: 'comments'
    }, {
        name: 'inspector', mapping: 'inspector'
    }, {
        name: 'inspector_sso', mapping: 'inspector_sso'
    }
    //    ,{
    //        name: 'inspection_record.qdt_inspection.urgency', mapping: 'inspection_record.qdt_inspection.urgency', convert: function (value, record) {
    //            if (record.get('urgent') == null) {
    //                return 'N/A';
    //            } else {
    //                return record.get('urgent');
    //            }
    //        }
    //    }, {
    //        name: 'inspection_record.qdt_inspection.passed', mapping: 'inspection_record.qdt_inspection.passed', convert: function (value, record) {
    //            if (record.data['passed'] == 1) {
    //                return '待检验';
    //            }
    //            else {
    //                return '已检验';
    //            }
    //        }
    //    }
    ]
});