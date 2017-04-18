Ext.define('QDT.model.dr.Action', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'action.act_id', mapping: 'action.act_id'
    }, {
        name: 'actionType.qdtComString.' + Profile.getLang() + '_string', mapping: 'actionType.qdtComString.' + Profile.getLang() + '_string'
    }, {
        name: 'action.act_type', mapping: 'action.act_type'
    }, {
        name: 'action.act_owner', mapping: 'action.act_owner'
    }, {
        name: 'action.st_action', mapping: 'action.st_action'
    }, {
        name: 'action.lt_action', mapping: 'action.lt_action'
    }, {
        name: 'action.ct_action', mapping: 'action.ct_action'
    }, {
        name: 'action.description', mapping: 'action.description'
    }, {
        name: 'action.complete_date', mapping: 'action.complete_date'
    }, {
        name: 'action.update_date', mapping: 'action.update_date'
    }, {
        name: 'action.create_date', mapping: 'action.create_date'
    }, {
        name: 'action.due_date', mapping: 'action.due_date'
    }, {
        name: 'action.disp_id', mapping: 'action.disp_id'
    }, {
        name: 'owner.employee.name_' + Profile.getLang(), mapping: 'owner.employee.name_' + Profile.getLang()
    }, {
        name: 'createBy.employee.name_' + Profile.getLang(), mapping: 'createBy.employee.name_' + Profile.getLang()
    }, {
        name: 'updateBy.employee.name_' + Profile.getLang(), mapping: 'updateBy.employee.name_' + Profile.getLang()
    }, {
        name: 'action.status', mapping: 'action.status'
    }, {
        name: 'action.remark', mapping: 'action.remark'
    }]
});