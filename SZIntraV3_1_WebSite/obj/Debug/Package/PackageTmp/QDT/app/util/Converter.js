Ext.define('QDT.util.Converter', {
    statics: {
        stageStatus: function (v, rec) {
            if (v > rec.data.cur_seq) {
                return 'open';
            }
            else if (v === rec.data.cur_seq) {
                return 'pending';
            }
            else {
                return 'approved';
            }
        }
    }
});