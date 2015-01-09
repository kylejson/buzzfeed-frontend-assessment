(function($) {

  window.CommentsModule = {

    settings: {
      container: '',
      template: '',
      loadButton: $('#load-more'),
      ajaxOptions: {
        url: 'http://www.buzzfeed.com/api/v1/comments/',
        context: this,
        dataType: 'json',
        data: {
          p: 0
        }
      }
    },

    context: {
      comments: []
    },

    init: function(articleId, templateSelector, container) {
      this.settings.container = container;
      this.settings.template = templateSelector.html();
      this.settings.ajaxOptions.url+=articleId;
      this.bindEvents();
      this.loadComments(this.settings.ajaxOptions); //first load
    },

    bindEvents: function() {
      this.settings.loadButton.on('click', function() {
        CommentsModule.loadComments(this.settings.ajaxOptions);
      }
      .bind(this));
    },

    loadComments: function(options) {
      this.settings.ajaxOptions.data.p+=1;

      $.ajax(options)
        .done(function(response) {
          if(!response.paging.next) {
            this.settings.loadButton.hide();
          }

          var items = response.comments;

          for(var i = 0; i <items.length; i++) {
            if(items[i].blurb) {
              this.context.comments.push(items[i]);
            }
          }

          var template = Handlebars.compile(this.settings.template);
          this.settings.container.append(template(this.context));
          this.context.comments = []; // this.context.comments.length = 0; is a non new memory alt but micro-optimization
          $("time.timeago").timeago();
        }
        .bind(this))
        .fail(function(jqxhr) {
          console.log(jqxhr.responseText);
        });
      }
  };
})(jQuery);
