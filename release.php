<?php

function recursiveCopy($source, $destination)
{
    if(is_dir($destination)) {
        exec("rm -rf $destination");
    }

    mkdir($destination, 0755);

    foreach($iterator = new \RecursiveIteratorIterator(
      new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
      \RecursiveIteratorIterator::SELF_FIRST) as $item
    ) {
        if($item->isDir()) {
            $name = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();

            if(!is_dir($name)) {
                mkdir($name);
                echo "Created directory $name\n";
            }
        } else {
            $name = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();
            copy($item, $name);

            echo "Copied $item -> $name\n";
        }
    }
}

if(!is_dir("../public/Packages")) {
    mkdir("../public/Packages");
}

recursiveCopy("./Packages/fontawesome5.12.0", "../public/Packages/fontawesome5.12.0");
