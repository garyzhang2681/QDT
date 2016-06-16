using System.Linq;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtIrdCharacteristic
    {
        public qdt_ird_characteristic ird_characteristic { get; set; }
        public QdtIrdGage irdFmlGage { get; set; }
        public QdtIrdGage irdBasicGage { get; set; }
        public QdtIrdRevision irdRevision { get; set; }

        public QdtIrdCharacteristic(qdt_ird_characteristic ird_characteristic)
        {
            this.ird_characteristic = ird_characteristic;
        }

        public static QdtIrdCharacteristic GetIrdCharacteristicById(int char_id)
        {
            return new QdtIrdCharacteristic(new QDTEntities().qdt_ird_characteristic.Single(n => n.char_id == char_id));
        }
        public void InitialProperties()
        {
            irdFmlGage = QdtIrdGage.GetIrdGageById(ird_characteristic.fml_gage_id.Value);
            irdBasicGage = QdtIrdGage.GetIrdGageById(ird_characteristic.basic_gage_id.Value);
            try
            {
                irdRevision = QdtIrdRevision.GetIrdRevisionById(ird_characteristic.ird_id);
            }
            catch
            {
                irdRevision = null;
            }
        }
    }
}