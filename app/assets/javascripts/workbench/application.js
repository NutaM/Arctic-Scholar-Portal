// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery-deparam
//= require jquery.transit
//= require workbench/slow-ajax
//= require twitter/bootstrap
//= require highstock
//= require highcharts-exporting
//= require leaflet
//= require json2
//= require underscore
//= require backbone
//= require geocens
//= require geocens-chart
//
//= require workbench/workbench

$(document).on("click", "a:not([data-bypass])", function(evt) {
  var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  var root = location.protocol + "//" + location.host + Backbone.history.options.root;

  if (href.prop && href.prop.slice(0, root.length) === root) {
    var route = href.prop.slice(root.length, href.prop.length).split("?")[0];
    evt.preventDefault();
    appRouter.navigate(route, { trigger: true });
  }
});
