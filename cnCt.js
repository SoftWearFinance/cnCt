/**
 * @name cnCt
 * @version 0.0.3
 * @description cnCt — JavaScript client template engine
 * @license MIT (license.txt)
 * @author Dmitry Makhnev, SoftWearFinance LLC
 * © SoftWearFinance LLC (http://softwearfinance.com/), Dmitry Makhnev (https://github.com/DmitryMakhnev)
 */

(function(_window, _document){
    var cnCt,
        _templatesList,
        u,
        abstractDIV = _document.createElement('div'),
        isArray = Array.isArray !== u ?
            function(essenceForTest){
                return Array.isArray(essenceForTest);
            }:
            function(essenceForTest){
                return Object.prototype.toString.call(essenceForTest) === '[object Array]';
            };

    function addToNeedNodes(needNodesName, $DOMNode, needNodes){
        var i;
        if (typeof needNodesName === 'string'){
            if (needNodesName in needNodes){
                if (isArray(needNodes[needNodesName])){
                    needNodes[needNodesName].push($DOMNode);
                } else{
                    needNodes[needNodesName] = [needNodes[needNodesName], $DOMNode];
                }
            } else{
                needNodes[needNodesName] = $DOMNode;
            }
        } else{
            for (i = needNodesName.length; i-- ;){
                addToNeedNodes(needNodesName[i], $DOMNode, needNodes);
            }
        }
    }

    function elementsDescriptorProcessing(elementsDescriptor, $parent, needNodes){
        var $DOMNode,
            i,
            iMax;
        if (isArray(elementsDescriptor)){
            for (i = 0, iMax = elementsDescriptor.length; i < iMax; i += 1){
                elementsDescriptorProcessing(elementsDescriptor[i], $parent, needNodes);
            }
        } else if (typeof elementsDescriptor === 'string'){
            $parent.appendChild(_document.createTextNode(elementsDescriptor));
        } else{
            $DOMNode = cnCt.createElement(elementsDescriptor, $parent);
            if ('n' in elementsDescriptor){
                addToNeedNodes(elementsDescriptor.n, $DOMNode, needNodes);
            }
            if ('C' in elementsDescriptor){
                elementsDescriptorProcessing(elementsDescriptor.C, $DOMNode, needNodes);
            }
        }
    }

    _window.cnCt = cnCt = {
        version: '0.0.3',
        /**
         * create DOM from HTML str
         * @param {String} htmlStr
         * @param {optional|HTMLElement} $parent DOM node for paste result HTML
         * @returns {HTMLElement} if ($parent) $parent
         *                        else documentFragment instance with paste result HTML
         */
        parseHTML: function(htmlStr, $parent){
            var child,
                i;
            abstractDIV.innerHTML = htmlStr;
            if ($parent === u){
                $parent = _document.createDocumentFragment();
            }
            child = abstractDIV.childNodes;
            for (i = child.length; i-- ;){
                $parent.appendChild(child[0]);
            }
            return $parent;
        },
        /**
         * check anything is DOM Node or not
         * @param {*} essenceForTest
         * @returns {boolean}
         */
        isDOMObject: function(essenceForTest){
            return (essenceForTest !== u) && (essenceForTest !== null) && ('nodeName' in essenceForTest);
        },
        /**
         * create DOM node from cnCt DOM node descriptor
         * @param {Object} elementDescriptor cnCt DOM node descriptor
         * @param {optional|HTMLElement} $parent DOM node for paste result
         * @returns {HTMLElement} result DOM node
         */
        createElement: function(elementDescriptor, $parent){
            var $DOMNode,
                p,
                objPointer;
            //        create element
            if (!('e' in elementDescriptor)){
                $DOMNode = _document.createElement('div');
            } else if ('N' in elementDescriptor){
                $DOMNode = _document.createElementNS(elementDescriptor.N, elementDescriptor.e);
            } else{
                $DOMNode = _document.createElement(elementDescriptor.e);
            }
            //        check properties
            if ('c' in elementDescriptor){
                $DOMNode.className = elementDescriptor.c;
            }
            if ('t' in elementDescriptor){
                $DOMNode.appendChild(_document.createTextNode(elementDescriptor.t));
            }
            if ('i' in elementDescriptor){
                $DOMNode.id = elementDescriptor.i;
            }
            if ('v' in elementDescriptor){
                $DOMNode.value = elementDescriptor.v;
            }
            if ('T' in elementDescriptor){
                $DOMNode.type = elementDescriptor.T;
            }
            if ('S' in elementDescriptor){
                $DOMNode.src = elementDescriptor.S;
            }
            if ('h' in elementDescriptor){
                $DOMNode.href = elementDescriptor.h;
            }
            if ('a' in elementDescriptor){
                objPointer = elementDescriptor.a;
                for (p in objPointer){
                    $DOMNode.setAttribute(p, objPointer[p]);
                }
            }
            if ('H' in elementDescriptor){
                cnCt.parseHTML(elementDescriptor.H, $DOMNode);
            }
            if ($parent !== u){
                $parent.appendChild($DOMNode);
            }
            return $DOMNode;
        },
        /**
         * create fragment DOM tree from cnCt DOM nodes descriptor
         * @param {Object|Array} elementsDescriptor cnCt DOM nodes descriptor
         * @param {optional|HTMLElement} $parent DOM node for paste result
         * @returns {{r: *, *: []}} if (elementsDescriptor is Array) {r: documentFragment instance with generated nodes, ...[n1]: *, ...[n2]: *, }
         *                          else {r: main elementsDescriptor DOM node, ...[n1]: *, ...[n2]: *, }
         */
        createElements: function (elementsDescriptor, $parent){
            var needNodes = {
                r: u
            };
            if (isArray(elementsDescriptor)){
                needNodes.r = _document.createDocumentFragment();
                elementsDescriptorProcessing(elementsDescriptor, needNodes.r, needNodes);
            } else{
                needNodes.r = cnCt.createElement(elementsDescriptor);
                if ('n' in elementsDescriptor){
                    addToNeedNodes(elementsDescriptor.n, needNodes.r, needNodes);
                }
                if ('C' in elementsDescriptor){
                    elementsDescriptorProcessing(elementsDescriptor.C, needNodes.r, needNodes);
                }
            }
            if ($parent !== u){
                $parent.appendChild(needNodes.r);
            }
            return needNodes;
        },
        /**
         * bind templates list object for cnCt.tp method
         * @param {Object} templatesList list of method returns element(s)Descriptor
         */
        bindTemplates: function(templatesList){
            _templatesList = templatesList;
        },
        /**
         * simple cnCt method
         * @param {function|string} template if (typeof template === 'string') cnCt get templatesList bind of bindTemplates method and call templatesList[template]
         *                                   else call template
         * @param {optional|*} data data for template function, if (data is DOMNode) $parent = data
         * @param {optional|HTMLElement} $parent DOM node for paste result
         * @returns {{r: *, *: []}} if (elementsDescriptor is Array) {r: documentFragment instance with generated nodes, ...[n1]: *, ...[n2]: *, }
         *                          else {r: main elementsDescriptor DOM node, ...[n1]: *, ...[n2]: *, }
         */
        tp: function(template, data, $parent){
            if (cnCt.isDOMObject(data)){
                $parent = data;
                data = u;
            }
            if (typeof template === 'string'){
                return cnCt.createElements(_templatesList[template](data), $parent);
            } else{
                return cnCt.createElements(template(data), $parent);
            }
        }
    };

}(window, document));