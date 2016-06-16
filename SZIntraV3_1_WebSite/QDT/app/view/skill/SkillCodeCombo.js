Ext.define('QDT.view.skill.SkillCodeCombo', {
    extend: 'Ext.form.field.ComboBox',
    queryMode: 'remote',
    alias: 'widget.skill-skillcodecombo',
    hideTrigger: true,
    forceSelection: true,
    minChars: 2,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            name: 'skill_code_id',
            fieldLabel: Profile.getText('skill_code'),
            store: Ext.create('QDT.store.skill.SkillCodes')
        });

        Ext.apply(me, {
            displayField: 'skill_code',
            valueField: 'id'
        });

        me.callParent();
    }


});