
css-parse = require('css-parse')

scroll-handlers = {}
sheets          = []

# From http://davidwalsh.name/add-rules-stylesheets

create-sheet = ->
    style = document.createElement "style" 
    style.setAttribute "media", "screen" 
    style.appendChild document.createTextNode ""  
    document.head.appendChild style 
    return style.sheet

get-css-rules = (sheet) ->
    if sheet.rules?
        return sheet.rules 
    else    
        return sheet.cssRules

add-css-rule = (sheet, selector, rules, index) ->
    if sheet.insert-rule?
        sheet.insert-rule "#selector { #rules }", index
    else 
        sheet.add-rule selector, rules, index

    index = get-css-rules(sheet).length - 1
    return { ref: get-css-rules(sheet)[index].style, index: index }

get-scroll-expression = (d) ->
    if (results = d.property is /\-dyn\-(.*)/)?
        property = results[1]
        if (results = d.value is /on\-scroll '(.*)'/)?
            return { property: property, expression: results[1] }
    return undefined

sat = (x) ->
    | x>1 => 1
    | x<0 => 0
    | otherwise => x 

easeOut = (context) ->
    { is-higher, is-lower } = context
    wn = context['when']
    if is-higher? and wn?
        return sat((is-higher - wn)/is-higher)

    if is-lower? and wn?
        v = sat((wn - is-lower)/is-lower)
        return v

window.dyn-css = {}

window.dynCss.lib = {
    easeOut: easeOut
}

create-function = (body) ->
    body = body.replace(/@/g,'this.lib.')
    script = document.createElement("script");
    script.text = "window.tmp = function() { return (#body); }.bind(window.dynCss);"
    document.head.appendChild( script ).parentNode.removeChild( script );
    return window.tmp

build-handlers = (rules, sheet) ->
   for rule in rules 
    if rule.type is "rule"
        sel = rule.selectors
        for decl in rule.declarations 
            result = get-scroll-expression(decl)
            if result?
                { property, expression, trigger} = result 
                { ref, index } = add-css-rule sheet, sel, ""
                handler = create-function expression
                wrapper = (next) ->
                    let i = index, fun = handler, pro = _.str.camelize(property), s = sel
                        (e) -> 
                            el = e.target
                            window.dynCss.lib['top'] = $(el).scrollTop()
                            get-css-rules(sheet)[i].style[pro] = fun()
                            next(e) if next?
                window.onscroll = wrapper(window.onscroll)



$('link[type="text/css"]').each (i,n) ->
    if n.href?
        $.get n.href, ->
            sheet = create-sheet()
            window.custom-sheet = sheet
            sheets.push(sheet)
            rules = css-parse(it).stylesheet.rules
            build-handlers(rules, sheet)
 
window.scroll-handlers = scroll-handlers
window.create-sheet = create-sheet