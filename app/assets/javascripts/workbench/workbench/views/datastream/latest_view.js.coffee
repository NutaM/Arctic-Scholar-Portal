class Workbench.Views.DatastreamLatestView extends Backbone.View
  template: JST["workbench/workbench/templates/latest"]

  initialize: ->
    @data = @options.data
    @unit = @options.unit

  render: ->
    latest = _.last(@data)
    @$el.html(@template({
      latest: latest[1]
      date:   new Date(latest[0])
      unit:   @unit
    }))
    this