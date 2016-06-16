Ext.define('Kanban.controller.TrainerApply', {
    extend: 'Ext.app.Controller',
    stores: ['TrainerApplys'],
    views: ['TrainerApplyGrid'],

    init: function () {
        this.control();
    }
});