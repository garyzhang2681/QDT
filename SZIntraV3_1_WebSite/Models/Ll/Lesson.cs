using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using Org.BouncyCastle.Utilities;

namespace SZIntraV3_1_WebSite.Models.Ll
{
    public class Lesson
    {
        public int id { get; set; }
        public int category_id { get; set; }
        public string subject { get; set; }
        public string detail { get; set; }
        public int owner_id { get; set; }
        public string business { get; set; }
        public DateTime create_date { get; set; }
        public int create_by { get; set; }
        public int attachment_quantity { get; set; }
        public string working_group { get; set; }
        public bool? restrict_all{get; set;}
        public int? effective_time { get; set; }
        public string status { get; set; }
        public int? failure_mode { get; set; }
        public int? learning_cycle { get; set; }

        public string skill_code_binding_mode { get; set; }

        public string part_num { get; set; }
        public int? oper_num { get; set; }
    }
}