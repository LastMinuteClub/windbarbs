# SVG Wind Barb Library Generator

This application will generate a wind barb javascript or typescript library. Output wind barbs are a text-representation of a HTML SVG element. The SVG's are generated through a plugin for Leaflet by [spatialsparks](https://github.com/spatialsparks/Leaflet.windbarb) and then converted into the library.

## Usage

_getWindBarb(**speed**: number, **angle**: number)_

1. To use wind barbs in your application, start by [generating the library](https://windbarbs.xlnks.com).
2. Move the library into your application's directory.
3. Import the library in your JS or TS application.
   - Within the head of your application's HTML:
   ```
   <script src="./windbarbs.js"></script>
   ```
   - Through TS import:
   ```
   import { WindBarbs } from './windbarbs';
   ```
4. Create and display a wind barb.

   - JS:

   ```
   document.addEventListener("DOMContentLoaded", () => {
       // get svg
       let barb = getWindBarb(22, 45);

       // create container and add the wind barb
       let container = document.createElement('div');
       container.innerHTML = barb;

       // display wind barb
       document.body.appendChild(container);
   });
   ```

   - TS:

   ```
   import { WindBarbs } from './windbarbs';

   document.addEventListener("DOMContentLoaded", () => {
       // get svg
       let barb = WindBarbs.getWindBarb(22, 45);

       // create container and add the wind barb
       let container = document.createElement('div');
       container.innerHTML = barb;

       // display wind barb
       document.body.appendChild(container);
   });
   ```

## Notes

- The generated library only contains wind barbs for speeds from 0 to 355.
- Whilst the generator displays them, the wind barbs do not come with a circle.
- The point radius can be used to move the wind barb further away from or closer to the center.
