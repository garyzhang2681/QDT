using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class Disposition
    {
        public int disp_id { get; set; }
        public int? disp_rank { get; set; }
        public string dr_num { get; set; }
        public string reason { get; set; }
        public int disp_type { get; set; }
        public string description { get; set; }
        public int? create_by { get; set; }
        public DateTime? create_date { get; set; }
        public int? update_by { get; set; }
        public DateTime? update_date { get; set; }
        public string status { get; set; }
        public string category_1 { get; set; }
        public string category_2 { get; set; }
        public string disp_type_string { get; set; }
      
        public Disposition(){}
        public Disposition(qdtGetDispositionsSP_Result disp, String language)
        {
            disp_id = disp.disp_id;
            disp_rank = disp.disp_rank;
            dr_num = disp.dr_num;
            reason = disp.reason;
            disp_type = disp.disp_type;
            description = disp.description;
            create_by = disp.create_by;
            create_date = disp.create_date;
            update_by = disp.update_by;
            update_date = disp.update_date;
            status = disp.status;
            category_1 = disp.category_1;
            category_2 = disp.category_2;
            disp_type_string =language.Equals("cn") ? disp.cn_string : disp.en_string;
        }

    }
}