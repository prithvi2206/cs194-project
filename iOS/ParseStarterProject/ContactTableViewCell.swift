//
//  ContactTableViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 2/23/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class ContactTableViewCell: UITableViewCell {
    var data: PFObject? {
        didSet {
            if data != nil {
                nameLabel.text = data!.objectForKey("name") as? String
                companyLabel.text = data!.objectForKey("company") as? String
                positionLabel.text = data!.objectForKey("title") as? String
                phoneNumberLabel.text = data!.objectForKey("phone") as? String
            }
            
        }
    }
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var companyLabel: UILabel!
    @IBOutlet weak var positionLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
}
