# Require any additional compass plugins here.

#Folder settings
relative_assets = true      #because we're not working from the root
css_dir = "css"          #where the CSS will saved
sass_dir = "scss"           #where our .scss files are
images_dir = "img"    #the folder with your images

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded # After dev :compressed
output_style = :compressed

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false

# Obviously
preferred_syntax = :scss

# Foundation
add_import_path "bower_components/foundation-sites/scss"