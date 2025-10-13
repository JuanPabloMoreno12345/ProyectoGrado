/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";

class EOSDashboardAction extends Component {
    static template = "mi90_eos.DashboardTemplate";
}

class EOSScorecardAction extends Component {
    static template = "mi90_eos.ScorecardTemplate";
}

class EOSRocksAction extends Component {
    static template = "mi90_eos.RocksTemplate";
}

class EOSTodosAction extends Component {
    static template = "mi90_eos.TodosTemplate";
}

class EOSIssuesAction extends Component {
    static template = "mi90_eos.IssuesTemplate";
}

class EOSMeetingsAction extends Component {
    static template = "mi90_eos.MeetingsTemplate";
}

class EOSHeadlinesAction extends Component {
    static template = "mi90_eos.HeadlinesTemplate";
}

class EOSVTOAction extends Component {
    static template = "mi90_eos.VTOTemplate";
}

class EOSAccountabilityAction extends Component {
    static template = "mi90_eos.AccountabilityTemplate";
}

class EOSOneOnOneAction extends Component {
    static template = "mi90_eos.OneOnOneTemplate";
}

class EOSProcessAction extends Component {
    static template = "mi90_eos.ProcessTemplate";
}

class EOSDirectoryAction extends Component {
    static template = "mi90_eos.DirectoryTemplate";
}

class EOSToolboxAction extends Component {
    static template = "mi90_eos.ToolboxTemplate";
}

// Registrar las acciones
registry.category("actions").add("mi90_eos.dashboard_action", EOSDashboardAction);
registry.category("actions").add("mi90_eos.scorecard_action", EOSScorecardAction);
registry.category("actions").add("mi90_eos.rocks_action", EOSRocksAction);
registry.category("actions").add("mi90_eos.todos_action", EOSTodosAction);
registry.category("actions").add("mi90_eos.issues_action", EOSIssuesAction);
registry.category("actions").add("mi90_eos.meetings_action", EOSMeetingsAction);
registry.category("actions").add("mi90_eos.headlines_action", EOSHeadlinesAction);
registry.category("actions").add("mi90_eos.vto_action", EOSVTOAction);
registry.category("actions").add("mi90_eos.accountability_action", EOSAccountabilityAction);
registry.category("actions").add("mi90_eos.oneonone_action", EOSOneOnOneAction);
registry.category("actions").add("mi90_eos.process_action", EOSProcessAction);
registry.category("actions").add("mi90_eos.directory_action", EOSDirectoryAction);
registry.category("actions").add("mi90_eos.toolbox_action", EOSToolboxAction);
