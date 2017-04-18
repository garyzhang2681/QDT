using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Org.BouncyCastle.Asn1.Crmf;
using Org.BouncyCastle.Tsp;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models.Rig
{
    public class Rig
    {
        private QDTEntities _qdtEntities = new QDTEntities();

        public string rig_num { get; set; }
        public string part_num { get; set; }
        public string liability { get; set; }
        public string defect_desc { get; set; }
        public string po_num { get; set; }
        public string coc_num { get; set; }
        public string grn_num { get; set; }
        public string part_desc { get; set; }
        public string drawing_num { get; set; }
        public string goods_returned_for { get; set; }
        public string quanlity_escape { get; set; }
        public string status { get; set; }
        public string dr_num { get; set; }

        public DateTime? create_date { get; set; }
        public DateTime? due_date { get; set; }
        public DateTime? due_date_from { get; set; }
        public DateTime? due_date_to { get; set; }
        public DateTime? create_date_from { get; set; }
        public DateTime? create_date_to { get; set; }



        public DateTime? goods_receive_date { get; set; }

        public int? po_line { get; set; }
        public int? qty_received { get; set; }
        public int? qty_rejected { get; set; }
        public int? create_by { get; set; }

        public List<qdtSearchRig_Result> QueryRIG()
        {

            List<qdtSearchRig_Result> searchResult =
                _qdtEntities.qdtSearchRig(rig_num, due_date_from, due_date_to, create_date_from, create_date_to,
                    create_by, status, dr_num).ToList();


            return searchResult;

        }




    }
}