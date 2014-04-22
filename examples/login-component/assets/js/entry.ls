
css-parse = require('css-parse')
window.mathjs = require('mathjs')()

scroll-handlers = {}
sheets = []

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
        if (results = d.value is /on\-scroll-of '(.*)' execute '(.*)'/)?
            return { property: property, trigger: results[1], expression: results[2] }
    return undefined


build-handlers = (rules, sheet) ->
   for rule in rules 
    if rule.type is "rule"
        sel = rule.selectors
        for decl in rule.declarations 
            result = get-scroll-expression(decl)
            if result?
                { property, expression , trigger} = result 
                handler = mathjs.compile(expression)
                { ref, index } = add-css-rule sheet, sel, ""
                # console.log "Setting up handler for #sel - #property = #expression"
                wrapper = (next) ->
                            let i = index, fun = handler, pro = _.str.camelize(property), s = sel
                                (e) -> 
                                    el = e.target
                                    scope = { top: $(el).scrollTop(), left: $(el).scrollLeft() }
                                    get-css-rules(sheet)[i].style[pro] = "black"
                                    # get-css-rules(sheet)[i].style[pro] = fun.eval()
                                    next(e) if next?


                if trigger == \body or trigger == \html or trigger == \document or trigger == \window
                    window.onscroll = wrapper(window.onscroll)
                else 
                    $(trigger).each (i, e) ->
                        e.addEventListener 'scroll', wrapper()


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