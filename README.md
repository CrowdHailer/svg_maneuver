svg_maneuver
============

Minimal Library and examples for inclusion of SVG cross browser

Example documents at www.londonlayout.co.uk/nav/index.htm (small svg)
Also at www.londonlayout.co.uk/nav/map.htm (large svg)

Approaches taken
================

Apply transform to svg group element
------------------------------------

This method used information from both the svg element and a g (group) element contained within.
The advantage of this is that all browsers that support svg support transform on elements in an svg so no proprietry prefixes are necessary.
Seams to re render all child nodes as a large svg is much slower than a small svg.

SET VIEW BOX TO WHOLE AREA THAT MIGHT BE SHOWN
SET INITIAL TRASFORM FOR HOME VIEW

Apply transform to svg element
------------------------------

Applies css transform to parent svg element.
Advantages include only needing to reference the parent svg and internal structure can be anything,
some suggestion that this is hardware accelerated on discussions I have read. Not sure on this point might need to use transform3d.

disadvantage is the need to proprietry prefixes. so far only implemented -webkit-

Transform by modifying viewbox
------------------------------

Advantages only look at one element. Internal svg structure unimportant.
All browsers use viewbox with svg so it should be possible to implement across browser. This the least developed branch and I have not tested across browsers

Disadvantage. Does not use standard matrix transforms to move svg.

Direct manipulation of CTM
--------------------------
Is it possible to directly set the Coordinate Transform Matrix?