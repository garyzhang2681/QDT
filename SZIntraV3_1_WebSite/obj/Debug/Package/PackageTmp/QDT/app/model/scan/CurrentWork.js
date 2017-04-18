Ext.define('QDT.model.scan.CurrentWork', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [{
        name: 'inspection_id'
    }, {
        name: 'id'
    }, {
        name: 'batch_id'
    }, {
        name: 'passed', type: 'boolean'
    }, {
        name: 'trans_type'
    }, {
        name: 'start_time', type: 'date'
    }, {
        name: 'current_time', type: 'date'
    }, {
        name: 'duration', convert: function (val, record) {
            var end = new Date(record.data['current_time']).getTime();
            var start = new Date(record.data['start_time']).getTime();
            var duration = (end - start) / 1000;
            var hour = Math.floor(duration / 3600);
            var min = Math.floor((duration / 60) % 60);
            var sec = Math.floor((duration % 60));
            return hour + 'h ' + min + 'm ' + sec + 's';
        }
    }, {
        name: 'machine_number'
    }, {
        name: 'item'
    }, {
        name: 'serial'
    }, {
        name: 'job'
    }, {
        name: 'suffix'
    }, {
        name: 'oper_num'
    }, {
        name: 'indirect_code'
    }, {
        name: 'project_id'
    }, {
        name: 'project'
    }, {
        name: 'qty_complete'
    }, {
        name: 'quantity' // from inspction quantity
    }, {
        name: 'qty_work_on'
    }, {
        name: 'original_oper_num'
    }, {
        name: 'next_location'
    }]
});
