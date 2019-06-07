<?php

// Fired during plugin deactivation. This class defines all code necessary to run during the plugin's deactivation.
class IIP_Map_Deactivator {

  public static function deactivate() {
    global $wpdb;
    $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}iip_map_data");
  }

}
