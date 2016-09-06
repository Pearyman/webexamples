$(function() {
    var t = $(".docs-form"),
        o = $(".docs-panel"),
        a = {};
    t.formcache(),
    // $('[data-toggle="tooltip"]').tooltip(),
    //
    // o.find("[data-option]").on("change", function() {
    //     var o = $(this),
    //         c = o.data("option");
    //     c && (a[c] = "checkbox" === this.type
    //         ? this.checked
    //         : JSON.parse(o.val()), t.formcache("destroy").formcache(a))
    // }),
    // o.on("click", "[data-method]", function() {
    //     var o,
    //         a = $(this).data();
    //     a.input && (a.option = JSON.parse($(a.input).val())),
    //     o = t.formcache(a.method, a.option),
    //     a.output && $(a.output).val(JSON.stringify(o))
    // })
});
