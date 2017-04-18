using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SZIntraV3_1_WebSite.Models.Ll
{
    public class Training
    {

        public int certification_id { get; set; }
        public int? lesson_id { get; set; }
        public int? request_id { get; set; }
        public int? employee_id { get; set; }
        public int? current_process_id { get; set; }
        public string subject { get; set; }
        public string detail { get; set; }
        public int category_id { get; set; }
        public string business { get; set; }
        public DateTime? start_time { get; set; }
        public DateTime? due_date { get; set; }
        public int? requestor { get; set; }
        public int? request_for { get; set; }
        public int owner_id { get; set; }
        public bool? restrict_all { get; set; }
        public string working_group { get; set; }
        public int? effective_time { get; set; }
        public string status { get; set; }
        public int current_step { get; set; }
        public string current_step_name { get; set; }
        public string current_approvers { get; set; }
        public int attachment_quantity { get; set; }
        public string part_num { get; set; }
    }
}
