Ext.define("QDT.model.DR", {
    extend: 'Ext.data.Model',
    fields: [
            { name: 'dr.dr_num', mapping: 'dr.dr_num' },
            { name: 'dr_num', mapping: 'dr.dr_num' },  // used for the combobox of VIEW SearchDR
            {name: 'drType.qdtComString.' + Profile.getLang() + '_string', mapping: 'drType.qdtComString.' + Profile.getLang() + '_string' },
            { name: 'source.qdtComString.' + Profile.getLang() + '_string', mapping: 'source.qdtComString.' + Profile.getLang() + '_string' },
            { name: 'dr.status', mapping: 'dr.status' },
            { name: 'dr.source', mapping: 'dr.source' },
            { name: 'source', mapping: 'dr.source' },
            { name: 'dr.dr_type', mapping: 'dr.dr_type' },
            { name: 'dr_type', mapping: 'dr.dr_type' },
            { name: 'dr.create_by', mapping: 'dr.create_by' },
            { name: 'create_by', mapping: 'dr.create_by' },
            { name: 'dr.create_date', mapping: 'dr.create_date' },
            { name: 'create_date', mapping: 'dr.create_date' },
            { name: 'createBy.user.sso', mapping: 'createBy.user.sso' },
            { name: 'createBy.user.name_' + Profile.getLang(), mapping: 'createBy.user.name_' + Profile.getLang() },
            { name: 'create_by_name', mapping: 'createBy.user.name_' + Profile.getLang() },
            { name: 'dr.due_date', mapping: 'dr.due_date' },
            { name: 'due_date', mapping: 'dr.due_date' },
            { name: 'dr.description', mapping: 'dr.description' },
            { name: 'dr_description', mapping: 'dr.description' },
            { name: 'qeOwner.employee.sso', mapping: 'qeOwner.employee.sso' },
            { name: 'meOwner.employee.sso', mapping: 'meOwner.employee.sso' },
            { name: 'qeOwner.employee.name_' + Profile.getLang(), mapping: 'qeOwner.employee.name_' + Profile.getLang() },
            { name: 'meOwner.employee.name_' + Profile.getLang(), mapping: 'meOwner.employee.name_' + Profile.getLang() },
            { name: 'dr_qe_owner', mapping: 'dr.dr_qe_owner' },
            { name: 'dr_me_owner', mapping: 'dr.dr_me_owner' },
            { name: 'dr.discrepancy_item', mapping: 'dr.discrepancy_item' },
            { name: 'discrepancy_item', mapping: 'dr.discrepancy_item' },
            { name: 'dr.job', mapping: 'dr.job' },
            { name: 'job', mapping: 'dr.job' },
            { name: 'dr.suffix', mapping: 'dr.suffix' },
            { name: 'suffix', mapping: 'dr.suffix' },
            { name: 'dr.oper_num', mapping: 'dr.oper_num' },
            { name: 'oper_num', mapping: 'dr.oper_num' },
            { name: 'dr.wc', mapping: 'dr.wc' },
            { name: 'dr.serial', mapping: 'dr.serial' },
            { name: 'dr.lot', mapping: 'dr.lot' },
            { name: 'dr.quantity', mapping: 'dr.quantity' },
            { name: 'quantity', mapping: 'dr.quantity' },

            { name: 'dr.Uf_item_ge_project', mapping: 'dr.Uf_item_ge_project' },
            { name: 'serial_lot', convert: function (val, record) {

                if (record.data['dr.serial'] == '') {
                    return record.data['dr.lot'];
                }
                else {
                    return record.data['dr.serial'];
                }
            }
            }, {
                name: 'serialOrLot',convert: function(val, record) {
                    if (record.data['dr.serial'] == '') {
                        return 'lot';
                    }
                    else {
                        return 'serial';
                    } 
                }
    }]
});
 
