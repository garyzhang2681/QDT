Ext.define('QDT.model.dr.Disposition', {
    extend: 'Ext.data.Model',
    fields: [{ name: 'disposition.disp_id', mapping: 'disposition.disp_id' },
            { name: 'disposition.disp_rank', mapping: 'disposition.disp_rank' },
            { name: 'disposition.dr_num', mapping: 'disposition.dr_num' },
            { name: 'disposition.reason', mapping: 'disposition.reason' },
            { name: 'responsibleDepartment.qdtComString.' + Profile.getLang() + '_string', mapping: 'responsibleDepartment.qdtComString.' + Profile.getLang() + '_string' },
            { name: 'responsibleDepartment', mapping: 'disposition.responsible_department' },
            { name: 'reasonType.qdtComString.' + Profile.getLang() + '_string', mapping: 'reasonType.qdtComString.' + Profile.getLang() + '_string' },
            { name: 'dispType.qdtComString.' + Profile.getLang() + '_string', mapping: 'dispType.qdtComString.' + Profile.getLang() + '_string' },
            { name: 'disposition.disp_type', mapping: 'disposition.disp_type' },
            { name: 'disposition.description', mapping: 'disposition.description' },
            { name: 'createBy.name_' + Profile.getLang(), mapping: 'createBy.name_' + Profile.getLang() },
            { name: 'disposition.create_date', mapping: 'disposition.create_date' },
            { name: 'disposition.status', mapping: 'disposition.status' },
            { name: 'me_employee_id', mapping: 'dr.dr.dr_me_owner' },
            { name: 'qe_employee_id', mapping: 'dr.dr.dr_qe_owner'}]
});