using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtIrdTransaction
    {
        public qdt_ird_transaction ird_transaction { get; set; }

        public QdtIrdRoute irdRoute { get; set; }
        public QdtInspectionRecordDetail ird_characteristic { get; set; }
        public HrEmployee user { get; set; }

        public QdtIrdTransaction()
        {
        }

        public QdtIrdTransaction(qdt_ird_transaction ird_transaction)
        {
            this.ird_transaction = ird_transaction;
        }

        public static QdtIrdTransaction GetIrdTransactionById(int trans_num)
        {
            return new QdtIrdTransaction(new QDTEntities().qdt_ird_transaction.Single(n => n.trans_num == trans_num));
        }

        public void InitialProperties()
        {
            irdRoute = QdtIrdRoute.GetIrdRouteById(ird_transaction.ird_route_id.Value);
            ird_characteristic = QdtInspectionRecordDetail.GetIrdCharacteristicById(ird_transaction.char_id.Value);
            user = HrEmployee.GetEmployeeById(ird_transaction.record_by.Value);
        }
    }
}