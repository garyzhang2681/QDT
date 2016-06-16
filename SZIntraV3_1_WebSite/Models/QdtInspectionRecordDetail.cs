using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtInspectionRecordDetail
    {
        public qdt_ird_characteristic ird_characteristic { get; set; }

        public QdtIrdRevision irdRevision { get; set; }
        public QdtIrdGage basicGage { get; set; }
        public QdtIrdGage fmlGage { get; set; }


        public QdtInspectionRecordDetail()
        {
        }

        public QdtInspectionRecordDetail(qdt_ird_characteristic ird_characteristic)
        {
            this.ird_characteristic = ird_characteristic;
        }

        public static QdtInspectionRecordDetail GetIrdCharacteristicById(int char_id)
        {
            return new QdtInspectionRecordDetail(new QDTEntities().qdt_ird_characteristic.Single(n => n.char_id == char_id));
        }

        public void InitialProperties()
        {
            irdRevision = QdtIrdRevision.GetIrdRevisionById(ird_characteristic.ird_id.Value);
            basicGage = QdtIrdGage.GetIrdGageById(ird_characteristic.basic_gage_id.Value);
            fmlGage = QdtIrdGage.GetIrdGageById(ird_characteristic.fml_gage_id.Value);
        }
    }
}