/**
 * DOM utility
 * @singleton
 * @author Rayraegah
 */
Motif.Dom.Utility = {
    /** Get an array of childnodes @type HTMLNode[] */
    getChildNodes: function(element) {
        var ret = [];
        if (!element) {
            return ret;
        }
        var len = element.childNodes.length;
        for (var i = 0; i < len; i++) {
            ret.push(element.childNodes[i]);
        }
        return ret;
    },

    /** Get the child elements by name and className @type HTMLElement[] */
    getChildElements: function(element, elementName, className) {
        var ret = [];
        if (!element) {
            return ret;
        }
        var len = element.childNodes.length;
        for (var i = 0; i < len; i++) {
            if (element.childNodes[i].nodeType == 1) {
                var chk1 = !elementName || elementName == "*" || element.childNodes[i].nodeName.toLowerCase() == elementName.toLowerCase();
                var chk2 = !className || Motif.Dom.Utility.containsClassName(element.childNodes[i], className);
                if (chk1 && chk2) {
                    ret.push(element.childNodes[i]);
                }
            }
        }

        return ret;
    },

    /** Get elements by attribute name and value */
    getElementsByAttribute: function(contextNode, attributeName, attributeValue) {
        var ret = [];
        for (var i = 0; i < contextNode.childNodes.length; i++) {
            if (contextNode.childNodes[i].nodeType == 1 && contextNode.childNodes[i].getAttribute(attributeName) == attributeValue)
                ret.push(contextNode.childNodes[i]);
        }
        return ret;
    },

    /** Get the child elements from the context element which have a className property which equals the supplied parameter @type HTMLElement[] */
    getElementsByClassName: function(contextNode, className) {
        var ret = [];
        for (var i = 0; i < contextNode.childNodes.length; i++) {
            if (contextNode.childNodes[i].nodeType == 1 && Motif.Dom.Utility.containsClassName(contextNode.childNodes[i], className))
                ret.push(contextNode.childNodes[i]);

            ret = ret.concat(Motif.Dom.Utility.getElementsByClassName(contextNode.childNodes[i], className));
        }
        return ret;
    },

    /** Check an element if it contains the CSS class @type Boolean */
    containsClassName: function(element, className) {
        var arr = element.className.split(" ");
        for (var i = 0; i < arr.length; i++)
            if (arr[i] == className)
                return true;

        return false;
    },

    /** Get  XHTML value of the supplied node, adds the option of replacing childnodes and attributes by name @type String */
    getXhtml: function(node, nodeReplace, attributeReplace, indent) {
        if (!node) {
            return "";
        }
        indent = indent || -1;
        var ret = [];
        nodeReplace = nodeReplace ? nodeReplace : {};
        attributeReplace = attributeReplace ? attributeReplace : {};

        if (node.nodeType == 1) {
            //replacing node names using nodeReplace
            var nodeName = node.nodeName.toLowerCase();
            if (nodeReplace[nodeName]) {
                nodeName = nodeReplace[nodeName];
            }

            ret.push("<" + nodeName);

            //adding attributes
            for (var i = 0; i < node.attributes.length; i++) {
                var attrName = node.attributes[i].nodeName.toLowerCase();
                if (typeof attributeReplace[attrName] != "undefined") {
                    attrName = attributeReplace[attrName];
                }
                var attrValue = node.attributes[i].nodeValue;
                if (attrValue != null && attrValue != "" && attrName != "")
                    ret.push(" " + attrName + "=\"" + attrValue + "\"");
            }

            if (typeof Motif.Ui.Xhtml.EmptyElements[nodeName] != "undefined") {
                ret.push(" />");
                return ret.join("");
            }

            ret.push(">");
            for (var i = 0; i < node.childNodes.length; i++) {
                switch (node.childNodes[i].nodeType) {
                    case 1:
                        ret.push(this.getXhtml(node.childNodes[i], nodeReplace, attributeReplace, indent > 0 ? indent++ : 1));
                        break;
                    case 3:
                        ret.push(node.childNodes[i].nodeValue);
                        break;
                    case 4:
                        ret.push("<![CDATA[" + node.childNodes[i].nodeValue + "]]>");
                        break;
                    case 7:
                        ret.push("<?" + node.childNodes[i].nodeName + " " + node.childNodes[i].data + ">");
                        break;
                    case 8:
                        ret.push("<!--" + node.childNodes[i].nodeValue + "-->");
                        break;

                }
            }

            //some browsers hide content of certain nodes
            if (node.childNodes.length == 0 && node.innerHTML.length > 0) {
                ret.push(node.innerHTML);
            }

            ret.push("</" + nodeName + ">");
        }
        return ret.join("");
    }
};