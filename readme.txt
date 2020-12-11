Description:

Image name and light positions are stored in JSON files.
In add mode, type in the text field to define the light name.
Rollover lights to see their data/properties.
Click on buttons to change status when light is selected.

Controls:

View mode:
LMB - click to select light, click again to deselect
Mouse Scroll - zoom
RMB - rotate
LCTRL + LMB - selection box for multiselect

Add mode:
LMB - add light
RMB - remove light

S - save and download data
D - load c1basement1
F - load c1basement2
C - reset camera
LCTRL + Space - toggle add/view mode

Notes:
- minor changes to SelectionHelper.js from three.js 
    - added LCTRLdown variable
    - added check for LMB and LCTRL to be pressed for selection box
      to appear
    - added check for null parent on lmb up