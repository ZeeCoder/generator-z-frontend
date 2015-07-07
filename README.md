
# Generator-Z-Frontend
[![Project Status](http://stillmaintained.com/ZeeCoder/generator-z-frontend.png)](http://stillmaintained.com/ZeeCoder/generator-z-frontend)

### Installation and Usage

run `npm install generator-z-frontend -g`

After that, you can run `yo z-frontend` from a project to start the
generator.

### Description

This is a heavily opinionated frontend generator, tailored to my needs.

I mostly use it to complement the way I work with the
[Symfony Framework](symfony.com), but in theory, it should work with any
framework.

As such, it may or may not work for you, but I'd be glad to hear out advices or
discuss PRs / feature-requests. :)

The workflow and rules described shortly are havily influenced by my personal
experiences working on several projects over the years, and also by OOCSS
methodologys and articles.

### Basic workflow

For the generator to work properly, a workflow must be adapted.

It assumes the following:

- The `vendors`, `images` and `watch` tasks are only ever run in the
developer's machines.

    The results of the vendors and images tasks can be tracked by a vcs even if
    there are more developers involved on the frontend.

    So whenever new images, or something were added to the vendors, these tasks
    then need to be run manually.

- The `styles` and `scripts` tasks are being run on every deployment.

    The output of these tasks depend on the environment (prod or dev) they are
    in. (ex: sourcemap generation) Also: if more than one frontend developer
    is involved in the project, it's very easy to introduce conflicts. However,
    by not tracking it by the vcs, and rebuilding the results on every
    deployment, resolves these possible issues.

### Rules

These rules are about the sass files which will make your life easier on the
long run. :)

Details about a particular file's role can be found in comments in that file.

**Classname naming conventions**

Presentational classes and javascript "hooks" must be separated.

 - Components must be prefixed with `c-`,
 - Javascript hooks must be prefixed with `js-`.
 - Every file, that is `@import`-ed in the main scss files (and not mentioned
above), must be prefixed with an underscore.

**The `styles/overwrites/` folder**

In this folder only 3rd party overwrites can be placed.

Examples may include: Foundation / Bootstrap, jQuery UI etc.

**The `styles/includes/` folder**

In this folder, only mixins and functions can be placed.
Every mixin and function must have a separate file, and the
filename must be the mixin's / function's name, prefixed with an
underscore, having the following syllables separated by a dash.
Ex.: `_my-mixin.scss`, which contains the `my-mixin` mixin.

**The `styles/components/` folder**

- Components must only be imported to the main scss files.
  (Ex.: app.scss)
- File naming convention: "c-a-component".
- Classnames are prefered to tags as the rules' selectors. If the component
  is small enough however (like a btn), and it is certain, that other
  components won't ever be embedded in it, then it can use tag-selectors too.
  (Ex.: "h1", "a" etc.) This is something that needs to be discussed by
  the team working on the project. For a true OOCSS workflow, tag selectors must
  be prohibited.
- Colors must be collected to variables and stored in the
  `config/_global.scss` file.

**The `styles/config/global.scss` file**

Color variables and global configurations must be placed here.
Follow the naming conventions presented there strictly.

### License

[MIT](LICENSE)
