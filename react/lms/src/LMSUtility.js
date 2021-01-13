export default class LMSUtility
{
    static Rad(deg)
    {
        return deg * Math.PI / 180;
    }

    static ResetCamera(controls, camera)
    {
    	controls.target.set(0.0, 0.0, 0.0);
    	camera.position.set(0.0, 45.4, 0.0);
    	controls.update();
    }

    static MoveToLight(name, controls, camera, outlinepass, lightarray)
    {
        var find = LMSUtility.FindLightByName(name, lightarray);

    	if (find)
    	{
    		find.userData.selected = true;
    		controls.target.set(find.position.x, find.position.y, find.position.z);
    		camera.position.set(find.position.x, find.position.y + 10, find.position.z);
    		outlinepass.selectedObjects = [find];
    		controls.update();
    	}
    }

    static FindLightByName(name, lightarray)
    {
        return lightarray.find(light => light.userData.name === name);
    }

    static FindLightByKey(key, lightarray)
    {
        return lightarray.find(light => light.userData.key === key);
    }

    static MultiSelect(id, mode, outlinepass, selectedlights, lightarray)
    {
        var found = false;

        if (id === 255)
        {
            for (var i = 0; i < lightarray.length; ++i)
            {
                if (!found)
                {
                    found = true;
                    outlinepass.selectedObjects.length = 0;
                    selectedlights.length = 0;
                }

                var light = lightarray[i];
                outlinepass.selectedObjects.push(light);
                selectedlights.push(light.userData.name);
            }
        }
        else
        {
            for (var j = 0; j < lightarray.length; ++j)
            {
                var light0 = lightarray[j];

                var push = false;
                // group
                if (mode)
                {
                    if (parseInt(light0.userData.groupId) === id)
                        push = true;
                }
                else
                {
                    if (parseInt(light0.userData.zoneId) === id)
                        push = true;
                }

                if (push)
                {
                    if (!found)
                    {
                        found = true;
                        outlinepass.selectedObjects.length = 0;
                        selectedlights.length = 0;
                    }

                    outlinepass.selectedObjects.push(light0);
                    selectedlights.push(light0.userData.name);
                }
            }
        }

        return found;
    }

    static CreateLight(mesh, name, key, pos)
    {
        // not sure why position.set doesn't work, this is okay though
    	mesh.position.x = pos.x;
    	mesh.position.y = pos.y;
    	mesh.position.z = pos.z;
    	mesh.scale.x = 0.35;
    	mesh.scale.y = 0.35;
    	mesh.scale.z = 0.35;

        // keys are just same as name for now
    	// add lightdata into the three.js mesh
        mesh.userData = {name: name, 
                         key: key, 
                         fwVersion : "1.0",
                         selected: false,
                         updateProgress: false,
                         provisionProgress: false,
                         lastHeard: "test", 
                         status: 2, 
                         pwm: 0,
                         msSens: "Medium",
                         syncClock: true,
                         maxBrightness: 100,
                         dimmedBrightness: 100,
                         msBrightness: 100,
                         holdTime: 0,
                         groupId: 255,
                         zoneId: 255,
                         triggerers: [],
                         triggerees: []};
    }

    static SetKey(oldkey, newkey, lightarray)
    {
        var index = lightarray.findIndex(light => light.userData.key === oldkey);
        lightarray[index].userData.key = newkey;
    }

    static SetFWVersion(key, fw, lightarray)
    {
        var find = LMSUtility.FindLightByKey(key, lightarray);
        if (find)
            find.userData.fwVersion = fw;
    }

    static SetBrightness(key, brightness, type, lightarray)
    {
        var find = LMSUtility.FindLightByKey(key, lightarray);
        if (find)
        {
            if (type === "max")
            {
                find.userData.maxBrightness = brightness;
                find.material.transparent = true;
                // range from 0.3 to 1.0
                find.material.opacity = 0.3 + brightness / 100 * 0.7;
            }
            else if (type === "dimmed")
            {
                find.userData.dimmedBrightness = brightness;
            }
            else if (type === "motion")
            {
                find.userData.msBrightness = brightness;
            }
        }
    }

    static SetGroup(id, selectedlights, lightarray)
    {
        for (var i = 0; i < selectedlights.length; ++i)
        {
            var light = LMSUtility.FindLightByName(selectedlights[i], lightarray);
            light.userData.groupId = id;
        }
    }

    static SetZone(id, selectedlights, lightarray)
    {
        for (var i = 0; i < selectedlights.length; ++i)
        {
            var light = LMSUtility.FindLightByName(selectedlights[i], lightarray);
            light.userData.zoneId = id;
        }
    }

    static ToggleTriggerLines(array)
    {
        for (var i = 0; i < array.length; ++i)
            array[i].visible = !array[i].visible;
    }
};